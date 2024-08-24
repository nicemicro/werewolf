extends Control

@onready var menuPlace: Control = %MenuCol
@onready var daySprite: TextureRect = $Background_day
var lobbyNode: VBoxContainer = null
var debugMode: bool = false
var background_night = false
const BACKGR_SPEED = 2

signal stateChanged

# Called when the node enters the scene tree for the first time.
func _ready():
	menuPlace.get_child(0).startButtonPressed.connect(openGameJoin)
	menuPlace.get_child(0).creditsPressed.connect(showCredits)

func _process(delta):
	var speed = delta * BACKGR_SPEED
	var accel = 0.51 - abs(0.5 - daySprite.modulate.a)
	speed = speed * accel
	if background_night:
		daySprite.modulate.a = daySprite.modulate.a + speed
		if daySprite.modulate.a >= 1:
			daySprite.modulate.a = 1
			background_night = false
	else:
		daySprite.modulate.a = daySprite.modulate.a - speed
		if daySprite.modulate.a <= 0:
			daySprite.modulate.a = 0
			background_night = true

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
