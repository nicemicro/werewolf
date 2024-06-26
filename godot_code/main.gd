extends Control

@onready var mainMenuWindow: VBoxContainer = $MainWindow
@onready var controller: Node = $GameNiteControlpads
var gameNode: Node = null

var gameState: String = "mainMenu"
var players: Dictionary = {}
var clients: Array = []

func _ready():
	mainMenuWindow.stateChanged.connect(stateChanged)
	randomize()

func stateChanged(newState: String, kwargs: Dictionary = {}):
	assert(gameState != newState)
	match newState:
		"joinGame":
			mainMenuWindow.lobbyNode.removePlayerIcons()
			for clientId in clients:
				sendMessage(clientId, "GAME_STARTED", {})
			mainMenuWindow.lobbyNode.playerNumberChange(len(players), len(clients))
		"credits":
			print_debug("credits")
		"mainMenu":
			for clientId in clients:
				sendMessage(clientId, "MAIN_MENU", {})
		"startGame":
			assert(gameNode == null)
			var gameScene = preload("res://game/game.tscn")
			var newGameNode: Control = gameScene.instantiate()
			gameNode = newGameNode
			if "debug" in kwargs and kwargs["debug"]:
				print_debug("debug on")
				gameNode.debugMode = true
			gameNode.changeScreen.connect(changePhoneScreen)
			gameNode.endGame.connect(backToLobby)
			add_child(gameNode)
			for clientId in clients:
				sendMessage(clientId, "PLAY", {})
			var roles: Dictionary = gameNode.assignRoles(players)
			for clientId in roles:
				sendMessage(clientId, "ASSIGN_ROLE", {"role": roles[clientId]})
	gameState = newState

func backToLobby():
	players = {}
	mainMenuWindow.show()
	stateChanged("joinGame")

func changePhoneScreen(targets: Array, screenName: String, payload: Dictionary = {}):
	if len(targets) == 0:
		return
	payload["switch_to"] = screenName
	if "players" not in payload.keys():
		payload["players"] = []
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
	payload["canStart"] = len(players) > 5
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
		"PICK_USER":
			gameNode.receiveMark(clientId, payload["name"])

func _on_game_nite_controlpads_message_received(clientId, message):
	print("received <%s> from <%s>" % [message, clientId])
	var jsonParser = JSON.new()
	var error = jsonParser.parse(message)
	if error != OK:
		print("JSON parsing error")
		return
	var data_received: Dictionary = jsonParser.data
	handleMessage(clientId, data_received)
