extends Control

@onready var menuPlace: Control = $MainWindow/Columns/MenuCol

# Called when the node enters the scene tree for the first time.
func _ready():
	menuPlace.get_child(0).connect("startButtonPressed", openGameJoin)

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func openGameJoin():
	var lobbyScene = preload("res://player_lobby.tscn")
	for child in menuPlace.get_children():
		child.queue_free()
	var lobbyNode: VBoxContainer = lobbyScene.instantiate()
	lobbyNode.connect("backToMain", openMainMenu)
	menuPlace.add_child(lobbyNode)

func openMainMenu():
	var menuScene = preload("res://main_menu.tscn")
	for child in menuPlace.get_children():
		child.queue_free()
	var menuNode: VBoxContainer = menuScene.instantiate()
	menuNode.connect("startButtonPressed", openGameJoin)
	menuPlace.add_child(menuNode)

func _on_game_nite_controlpads_message_received(client, message):
	print("received <%s> from <%s>" % [message, client])


func _on_exit_button_pressed():
	get_tree().quit()
