extends MarginContainer

var playerName: String = ""
@onready var nameLabel: Label = $Container/Name
@onready var votedMark: TextureRect = $MarginContainer/VoteIcon

func _ready():
	nameLabel.text = playerName

func setName(newName: String):
	playerName = newName
	if nameLabel != null:
		nameLabel.text = playerName

func setVoted():
	votedMark.visible = true
