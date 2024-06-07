extends VBoxContainer

@onready var menuPlace: Control = $Columns/MenuCol
var lobbyNode: VBoxContainer = null
var debugMode: bool = false

signal stateChanged

# Called when the node enters the scene tree for the first time.
func _ready():
	menuPlace.get_child(0).startButtonPressed.connect(openGameJoin)
	menuPlace.get_child(0).creditsPressed.connect(showCredits)

func openGameJoin():
	var lobbyScene = preload("res://player_lobby.tscn")
	for child in menuPlace.get_children():
		child.queue_free()
	lobbyNode = lobbyScene.instantiate()
	lobbyNode.backToMain.connect(openMainMenu)
	lobbyNode.startGame.connect(startGame)
	menuPlace.add_child(lobbyNode)
	emit_signal("stateChanged", "joinGame")

func openMainMenu():
	var menuScene = preload("res://main_menu.tscn")
	for child in menuPlace.get_children():
		child.queue_free()
	var menuNode: VBoxContainer = menuScene.instantiate()
	lobbyNode = null
	menuNode.startButtonPressed.connect(openGameJoin)
	menuNode.creditsPressed.connect(showCredits)
	menuPlace.add_child(menuNode)
	emit_signal("stateChanged", "mainMenu")

func startGame():
	var kwargs: Dictionary = {}
	if debugMode:
		kwargs["debug"] = true
	emit_signal("stateChanged", "startGame", kwargs)
	hide()

func showCredits():
	var creditsScene = preload("res://credits.tscn")
	for child in menuPlace.get_children():
		child.queue_free()
	var creditsNode = creditsScene.instantiate()
	creditsNode.backToMain.connect(openMainMenu)
	menuPlace.add_child(creditsNode)
	emit_signal("stateChanged", "credits")

func _on_exit_button_pressed():
	get_tree().quit()

func _on_check_box_toggled(toggled_on: bool):
	debugMode = toggled_on
