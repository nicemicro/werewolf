extends VBoxContainer

@onready var playerIconGrid: GridContainer = $PlayerIcons
@onready var gameStartButton: Button = $HBoxContainer/StartButton
@onready var playerNumberInfo: Label = $HBoxContainer2/Number

signal backToMain
signal startGame

func removePlayerIcons():
	for icon in playerIconGrid.get_children():
		icon.queue_free()

func newPlayerJoins(_clientId: String, playerName: String):
	var playerIconScene = preload("res://lobby/player_icon.tscn")
	var playerIcon = playerIconScene.instantiate()
	playerIcon.setName(playerName)
	playerIconGrid.add_child(playerIcon)

func gameCanStart(canStart: bool):
	gameStartButton.visible = canStart

func playerNumberChange(inLobby: int, allPlayers: int):
	playerNumberInfo.text = str(inLobby) + "/" + str(allPlayers)

func _on_backButton_pressed():
	emit_signal("backToMain")

func _on_start_button_pressed():
	emit_signal("startGame")
