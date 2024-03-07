extends VBoxContainer

@onready var playerIconGrid: GridContainer = $PlayerIcons

signal backToMain

func newPlayerJoins(clientId: String, playerName: String):
	print_debug(clientId, "  ", playerName)
	var playerIconScene = preload("res://lobby/player_icon.tscn")
	var playerIcon = playerIconScene.instantiate()
	playerIcon.setName(playerName)
	playerIconGrid.add_child(playerIcon)

func _on_button_pressed():
	emit_signal("backToMain")
