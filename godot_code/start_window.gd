extends VBoxContainer

@onready var menuPlace: Control = $Columns/MenuCol
var lobbyNode: VBoxContainer = null

signal stateChanged

# Called when the node enters the scene tree for the first time.
func _ready():
	menuPlace.get_child(0).connect("startButtonPressed", openGameJoin)

func openGameJoin():
	var lobbyScene = preload("res://player_lobby.tscn")
	for child in menuPlace.get_children():
		child.queue_free()
	lobbyNode = lobbyScene.instantiate()
	lobbyNode.connect("backToMain", openMainMenu)
	lobbyNode.connect("startGame", startGame)
	menuPlace.add_child(lobbyNode)
	emit_signal("stateChanged", "joinGame")

func openMainMenu():
	var menuScene = preload("res://main_menu.tscn")
	for child in menuPlace.get_children():
		child.queue_free()
	var menuNode: VBoxContainer = menuScene.instantiate()
	lobbyNode = null
	menuNode.connect("startButtonPressed", openGameJoin)
	menuPlace.add_child(menuNode)
	emit_signal("stateChanged", "mainMenu")

func startGame():
	emit_signal("stateChanged", "startGame")
	queue_free()

func _on_exit_button_pressed():
	get_tree().quit()
