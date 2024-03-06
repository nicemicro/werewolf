extends Control

@onready var mainMenuWindow: VBoxContainer = $MainWindow
@onready var controller: Node = $GameNiteControlpads
var gameNode: Node = null

var gameState: String = "mainMenu"
var players: Dictionary = {}

func _ready():
	mainMenuWindow.connect("stateChanged", stateChanged)

func stateChanged(newState: String):
	match newState:
		"startGame":
			assert(gameState != "startGame")
			assert(gameNode == null)
			var gameScene = preload("res://game/game.tscn")
			var newGameNode: Control = gameScene.instantiate()
			gameNode = newGameNode
			add_child(gameNode)
	gameState = newState

func playerJoins(clientId: String, playerName: String):
	if gameState != "joinGame":
		print_debug("can't join now")
		sendMessage(clientId, "JoinFailed", {"status": "notAvailable"})
		return
	if clientId in players:
		print_debug("already joined")
		sendMessage(clientId, "JoinFailed", {"status": "alreadyJoined"})
	sendMessage(clientId, "Joined", {"status": "success"})
	players[clientId] = playerName
	mainMenuWindow.lobbyNode.newPlayerJoins(clientId, playerName)
	if len(players) > 5:
		mainMenuWindow.lobbyNode.gameCanStart(true)

func sendMessage(clientId: String, msgType: String, payload: Dictionary):
	var message: Dictionary = {
		"type": msgType,
		"payload": payload
	}
	controller.send_message(clientId, JSON.stringify(message))
	print_debug("send message ", JSON.stringify(message))

func handleMessage(clientId: String, message: Dictionary):
	var command: String = message["type"]
	var payload: Dictionary = message["payload"]
	match command:
		"SUBMIT_NAME":
			playerJoins(clientId, payload["name"])

func _on_game_nite_controlpads_message_received(clientId, message):
	print("received <%s> from <%s>" % [message, clientId])
	var jsonParser = JSON.new()
	var error = jsonParser.parse(message)
	if error != OK:
		print("JSON parsing error")
		return
	var data_received: Dictionary = jsonParser.data
	handleMessage(clientId, data_received)
