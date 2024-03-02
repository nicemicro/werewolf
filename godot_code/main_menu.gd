extends VBoxContainer

signal startButtonPressed

func _on_start_button_pressed():
	emit_signal("startButtonPressed")
