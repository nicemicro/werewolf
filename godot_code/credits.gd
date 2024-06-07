extends PanelContainer

signal backToMain


func _on_back_pressed():
	emit_signal("backToMain")
