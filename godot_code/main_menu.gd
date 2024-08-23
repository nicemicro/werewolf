extends VBoxContainer

signal startButtonPressed
signal creditsPressed

func _on_start_button_pressed():
	emit_signal("startButtonPressed")


func _on_credits_button_pressed():
	emit_signal("creditsPressed")
