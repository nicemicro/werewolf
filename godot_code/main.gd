extends Control


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _on_game_nite_controlpads_message_received(client, message):
	print("received <%s> from <%s>" % [message, client])
