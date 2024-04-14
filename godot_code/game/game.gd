extends MarginContainer

signal changeScreen
signal endGame

@onready var dayScreen = $DayBackground
@onready var nightScreen = $NightBackground
@onready var playerGrid = $DayBackground/Container/PlayersGrid
@onready var timer: Timer = $Timers/StepTimer
@onready var announceDead = $DayBackground/Container/AnnounceDead
@onready var announceWinners = $GameEndBackg/Container/AnnounceWinners
@onready var gameEndScreen = $GameEndBackg
@onready var firstNight: Dictionary = {
	"name": "firstNight",
	"timers": [10, 5, 2, 10, 2, 10, 2, 1],
	"screens": [
		$NightBackground/Container/GoToSleep,
		$NightBackground/Container/BothKillersWakeUp,
		$NightBackground/Container/GoToSleep,
		$NightBackground/Container/Cultist1Votes,
		$NightBackground/Container/GoToSleep,
		$NightBackground/Container/Cultist2Votes,
		$NightBackground/Container/GoToSleep
	],
	"command": [
		nightSets,
		killersSeeEachother,
		killersBackToSleep,
		killer1Select,
		killersBackToSleep,
		killer2Select,
		killersBackToSleep,
		morningComes
	]
}
@onready var dayCycle: Dictionary = {
	"name": "day",
	"timers": [10, 25, 5, 10, 1],
	"screens": [
		$DayBackground/Container/AnnounceDead,
		$DayBackground/Container/PlayersGrid,
		$DayBackground/Container/VoteOver,
		$DayBackground/Container/AnnounceDead
	],
	"command": [
		null, votingStarts, votingEnds, votingResults, nightComes
	]
}
@onready var nightSequence: Dictionary = {
	"name": "night",
	"timers": [10, 10, 2, 10, 2, 1],
	"screens": [
		$NightBackground/Container/GoToSleep,
		$NightBackground/Container/Cultist1Votes,
		$NightBackground/Container/GoToSleep,
		$NightBackground/Container/Cultist2Votes,
		$NightBackground/Container/GoToSleep
	],
	"command": [
		null,
		killer1Select,
		killersBackToSleep,
		killer2Select,
		killersBackToSleep,
		morningComes
	]
}
@onready var endSequence: Dictionary = {
	"name": "end",
	"timers": [10, 10],
	"screens": [announceWinners],
	"command": [null, close]
}

var currentNum: int
var currentSequence: Dictionary
var players: Dictionary
var playerRoles: Dictionary
var acceptVotes: Array
var votes: Dictionary
var voteIcons: Dictionary

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
	acceptVotes = []
	votes = {}

func close():
	emit_signal("endGame")
	queue_free()

func nightSets():
	emit_signal("changeScreen", players.keys(), "night")

func morningComes():
	print(votes)
	var cultistNum: int = 0
	var voteNum: int = 0
	for role in playerRoles.values():
		if role == RoleList.CULTIST1 or role == RoleList.CULTIST2:
			cultistNum += 1
	var voteTarget: String = ""
	for votedId in votes.values():
		voteNum += 1
		if voteTarget == "":
			voteTarget = votedId
		elif voteTarget != votedId:
			voteTarget = ""
	if voteNum == cultistNum and voteTarget != "":
		announceDead.text = players[voteTarget] + " was killed at night"
		players.erase(voteTarget)
		playerRoles.erase(voteTarget)
		emit_signal("changeScreen", [voteTarget], "death")
		var winner: int = checkWinner()
		if winner != 0:
			gameEnd(winner)
			return
	else:
		announceDead.text = "No one is dead"
	nightScreen.visible = false
	dayScreen.visible = true
	emit_signal("changeScreen", players.keys(), "morning")
	currentSequence = dayCycle
	currentNum = -1 #After this, curentNum will be incremented by one
	votes = {}

func nightComes():
	var winner: int = checkWinner()
	if winner != 0:
		gameEnd(winner)
		return
	currentNum = -1
	currentSequence = nightSequence
	acceptVotes = []
	nightScreen.visible = true
	dayScreen.visible = false
	votes = {}
	emit_signal("changeScreen", players.keys(), "night")

func gameEnd(winner: int):
	assert (winner == -1 or winner == 1)
	currentNum = -1
	currentSequence = endSequence
	acceptVotes = []
	gameEndScreen.show()
	if winner == -1:
		announceWinners.text = "The cultists have taken over the village."
	else:
		announceWinners.text = "The villagers have removed all the cultists."

func checkWinner() -> int:
	var killerNum: int = len(getRoleId([RoleList.CULTIST1, RoleList.CULTIST2]))
	if killerNum == 0:
		return 1
	if len(players) <= killerNum + 1:
		return -1
	return 0

func getRoleId(roles: Array):
	var sendTo: Array = []
	for playerId in playerRoles:
		if playerRoles[playerId] in roles:
			sendTo.append(playerId)
	return sendTo

func votingStarts():
	emit_signal("changeScreen", players.keys(), "start vote", {"players": players})
	var playerIconScene: PackedScene = load("res://game/player_voted.tscn")
	for child in playerGrid.get_children():
		playerGrid.remove_child(child)
		child.queue_free()
	var newIcon: Control
	voteIcons = {}
	for player in players:
		newIcon = playerIconScene.instantiate()
		newIcon.setName(players[player])
		voteIcons[player] = newIcon
		playerGrid.add_child(newIcon)
	acceptVotes = [
		RoleList.CULTIST1, RoleList.CULTIST2, RoleList.SEER, RoleList.SHAMAN, RoleList.VILLAGER
	]

func votingEnds():
	emit_signal("changeScreen", players.keys(), "end vote")
	acceptVotes = []

func votingResults():
	print(votes)
	var voteNums: Dictionary = {}
	var maxVotes: String = ""
	var maxVoteNum: int = 0
	for votedId in votes.values():
		if votedId in voteNums.keys():
			voteNums[votedId] += 1
		else:
			voteNums[votedId] = 1
		if voteNums[votedId] > maxVoteNum:
			maxVoteNum = voteNums[votedId]
			maxVotes = votedId
	if maxVotes != "":
		announceDead.text = players[maxVotes] + " was executed by the village"
		players.erase(maxVotes)
		playerRoles.erase(maxVotes)
		emit_signal("changeScreen", [maxVotes], "death")
	else:
		announceDead.text = "No one is dead"

func killer1Select():
	acceptVotes = [RoleList.CULTIST1]
	emit_signal("changeScreen", getRoleId([RoleList.CULTIST1]), "killvote")

func killer2Select():
	acceptVotes = [RoleList.CULTIST2]
	emit_signal("changeScreen", getRoleId([RoleList.CULTIST2]), "killvote")

func killersSeeEachother():
	emit_signal(
		"changeScreen",
		getRoleId([RoleList.CULTIST1]),
		"look up",
		{"partner": players[getRoleId([RoleList.CULTIST2])[0]]}
	)
	emit_signal(
		"changeScreen",
		getRoleId([RoleList.CULTIST2]),
		"look up",
		{"partner": players[getRoleId([RoleList.CULTIST1])[0]]}
	)

func killersBackToSleep():
	acceptVotes = []
	emit_signal("changeScreen", getRoleId([RoleList.CULTIST1, RoleList.CULTIST2]), "night")

func receiveMark(markFrom, markForName):
	if not playerRoles[markFrom] in acceptVotes:
		print("vote is not accepted from ", players[markFrom])
		return
	if currentSequence["name"] == "night" and playerRoles[markFrom] == RoleList.SEER:
		# This will deal with the seer's reply for whether the selecter player is a worshipper
		return
	for playerId in players:
		if players[playerId] == markForName:
			votes[markFrom] = playerId
			if currentSequence["name"] == "day":
				voteIcons[markFrom].setVoted()

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
	if currentNum >= 1:
		currentSequence["screens"][currentNum-1].hide()
	if currentNum < len(currentSequence["screens"]):
		currentSequence["screens"][currentNum].show()
	if currentNum < len(currentSequence["timers"]):
		timer.start(currentSequence["timers"][currentNum])
	if currentSequence["command"][currentNum] != null:
		currentSequence["command"][currentNum].call()
	currentNum += 1
