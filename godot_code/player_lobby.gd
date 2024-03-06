extends VBoxContainer

@onready var playerIconGrid: GridContainer = $PlayerIcons
@onready var gameStartButton: Button = $HBoxContainer/StartButton

signal backToMain
signal startGame

func newPlayerJoins(clientId: String, playerName: String):
	print_debug(clientId, "  ", playerName)
	var playerIconScene = preload("res://lobby/player_icon.tscn")
	var playerIcon = playerIconScene.instantiate()
	playerIcon.setName(playerName)
	playerIconGrid.add_child(playerIcon)

func gameCanStart(canStart: bool):
	gameStartButton.visible = canStart

func _on_backButton_pressed():
	emit_signal("backToMain")

func _on_start_button_pressed():
	emit_signal("startGame")
