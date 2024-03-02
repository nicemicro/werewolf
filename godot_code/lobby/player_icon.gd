extends MarginContainer

var playerName: String = ""
@onready var nameLabel: Label = $Name

func _ready():
	nameLabel.text = playerName

func setName(newName: String):
	playerName = newName
	if nameLabel != null:
		nameLabel.text = playerName
