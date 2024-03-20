extends MarginContainer

signal changeScreen

@onready var dayScreen = $DayBackground
@onready var nightScreen = $NightBackground
@onready var playerGrid = $DayBackground/Container/PlayersGrid
@onready var firstNight: Dictionary = {
	"timers": [
		$Timers/BothKillersWakeUp,
		$Timers/BothKillersSleep,
		$Timers/GoodMorning,
		$Timers/VoteStart
	],
	"screens": [
		$NightBackground/Container/GoToSleep,
		$NightBackground/Container/BothKillersWakeUp,
		$NightBackground/Container/GoToSleep
	],
	"command": [
		firstNightSets, killersSeeEachother, killersBackToSleep, morningComes
	]
}
@onready var dayCycle: Dictionary = {
	"timers": [
		$Timers/VoteEnds,
		$Timers/GoodNight
	],
	"screens": [
		$DayBackground/Container/PlayersGrid,
		$DayBackground/Container/VoteOver
	],
	"command": [
		votingStarts, votingResults, null
	]
}

var currentNum: int
var currentSequence: Dictionary
var players: Dictionary
var playerRoles: Dictionary

enum RoleList { # DO NOT CHANGE THIS without also consulting the controller code for roles
	VILLAGER,
	CULTIST1,
	CULTIST2,
	SEER,
	SHAMAN
}

func _ready():
	currentNum = 0
	currentSequence = firstNight

func firstNightSets():
	emit_signal("changeScreen", [], "night")

func morningComes():
	nightScreen.visible = false
	dayScreen.visible = true
	emit_signal("changeScreen", [], "morning")
	currentSequence = dayCycle
	currentNum = -1 #After this, curentNum will be incremented by one

func getKillerId():
	var sendTo: Array = []
	for playerId in playerRoles:
		if (
			playerRoles[playerId] == RoleList.CULTIST1 or
			playerRoles[playerId] == RoleList.CULTIST2
		):
			sendTo.append(playerId)
	return sendTo

func votingStarts():
	emit_signal("changeScreen", [], "start vote", {"players": players})
	var playerIconScene: PackedScene = load("res://game/player_voted.tscn")
	for child in playerGrid.get_children():
		playerGrid.remove_child(child)
		child.queue_free()
	var newIcon: Control
	for player in players:
		newIcon = playerIconScene.instantiate()
		newIcon.setName(players[player])
		playerGrid.add_child(newIcon)

func votingResults():
	emit_signal("changeScreen", [], "end vote")

func killersSeeEachother():
	emit_signal("changeScreen", getKillerId(), "look up")

func killersBackToSleep():
	emit_signal("changeScreen", getKillerId(), "night")

func assignRoles(newPlayers: Dictionary):
	players = newPlayers
	for role in RoleList:
		if RoleList[role] == RoleList.VILLAGER:
			continue
		newRole(RoleList[role])
	for clientId in players:
		if not clientId in playerRoles:
			playerRoles[clientId] = RoleList.VILLAGER
	return playerRoles.duplicate()

func newRole(roleToAdd: RoleList):
	var playerList: Array = []
	for clientId in players:
		if not clientId in playerRoles:
			playerList.append(clientId)
	var selected = randi_range(0, len(playerList) - 1)
	playerRoles[playerList[selected]] = roleToAdd

func _changeScreen():
	if currentNum < len(currentSequence["screens"]):
		currentSequence["screens"][currentNum].show()
	if currentNum >= 1:
		currentSequence["screens"][currentNum-1].hide()
	if currentNum < len(currentSequence["timers"]):
		currentSequence["timers"][currentNum].start()
	if currentSequence["command"][currentNum] != null:
		currentSequence["command"][currentNum].call()
	currentNum += 1
