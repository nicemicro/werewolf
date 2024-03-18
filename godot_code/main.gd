extends Control

@onready var mainMenuWindow: VBoxContainer = $MainWindow
@onready var controller: Node = $GameNiteControlpads
var gameNode: Node = null

var gameState: String = "mainMenu"
var players: Dictionary = {}
var clients: Array = []

func _ready():
	mainMenuWindow.connect("stateChanged", stateChanged)
	randomize()

func stateChanged(newState: String):
	assert(gameState != newState)
	match newState:
		"joinGame":
			for clientId in clients:
				sendMessage(clientId, "GAME_STARTED", {})
			mainMenuWindow.lobbyNode.playerNumberChange(len(players), len(clients))
		"mainMenu":
			for clientId in clients:
				sendMessage(clientId, "MAIN_MENU", {})
		"startGame":
			assert(gameNode == null)
			var gameScene = preload("res://game/game.tscn")
			var newGameNode: Control = gameScene.instantiate()
			gameNode = newGameNode
			gameNode.connect("changeScreen", changePhoneScreen)
			add_child(gameNode)
			for clientId in clients:
				sendMessage(clientId, "PLAY", {})
			var roles: Dictionary = gameNode.assignRoles(players)
			for clientId in roles:
				sendMessage(clientId, "ASSIGN_ROLE", {"role": roles[clientId]})
	gameState = newState

func changePhoneScreen(targets: Array, screenName: String):
	if len(targets) == 0:
		targets = players.keys()
	var payload: Dictionary = {
		"switch_to": screenName
	}
	for clientId in targets:
		sendMessage(clientId, "SCREEN_SWITCH", payload)

func playerJoins(clientId: String, playerName: String):
	if gameState != "joinGame":
		print_debug("can't join now")
		sendMessage(clientId, "JOIN_FAILED", {"status": "notAvailable"})
		return
	if clientId in players:
		print_debug("already joined")
		sendMessage(clientId, "JOIN_FAILED", {
			"status": "alreadyJoined",
			"name": players[clientId]
		})
		return
	if playerName in players.values():
		print_debug("name already used")
		sendMessage(clientId, "JOIN_FAILED", {"status": "Name in use"})
		return
	sendMessage(clientId, "JOINED", {"status": "success"})
	players[clientId] = playerName
	mainMenuWindow.lobbyNode.newPlayerJoins(clientId, playerName)
	mainMenuWindow.lobbyNode.playerNumberChange(len(players), len(clients))
	if len(players) > 5:
		mainMenuWindow.lobbyNode.gameCanStart(true)
		# Send can start to all players with names, this will be sent for every extra person that joins
		for c in players.keys(): 
			sendMessage(c, 'CAN_START', {})

func syncState(clientId):
	var payload: Dictionary = {}
	if not clientId in clients:
		clients.append(clientId)
	if clientId in players:
		payload["name"] = players[clientId]
	payload["gameState"] = gameState
	sendMessage(clientId, "STATE_SYNC", payload)

func sendMessage(clientId: String, msgType: String, payload: Dictionary):
	var message: Dictionary = {
		"type": msgType,
		"payload": payload
	}
	controller.send_message(clientId, JSON.stringify(message))
	print("send message to <%s>: <%s>" % [clientId, JSON.stringify(message)])

func handleMessage(clientId: String, message: Dictionary):
	var command: String = message["type"]
	var payload: Dictionary = message["payload"]
	match command:
		"SYNC":
			syncState(clientId)
		"SUBMIT_NAME":
			playerJoins(clientId, payload["name"])
		"START_GAME":
			if gameState != "mainMenu":
				return
			mainMenuWindow.openGameJoin()
		"START_PLAY":
			stateChanged("startGame")

func _on_game_nite_controlpads_message_received(clientId, message):
	print("received <%s> from <%s>" % [message, clientId])
	var jsonParser = JSON.new()
	var error = jsonParser.parse(message)
	if error != OK:
		print("JSON parsing error")
		return
	var data_received: Dictionary = jsonParser.data
	handleMessage(clientId, data_received)
