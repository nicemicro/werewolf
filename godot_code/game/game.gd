extends MarginContainer

signal changeScreen

@onready var dayScreen = $DayBackground
@onready var nightScreen = $NightBackground
@onready var playerGrid = $DayBackground/Container/PlayersGrid
@onready var timer: Timer = $Timers/StepTimer
@onready var announceDead = $DayBackground/Container/AnnounceDead
@onready var firstNight: Dictionary = {
	"timers": [10, 5, 2, 10, 2, 10, 2, 2],
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
		firstNightSets,
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
	"timers": [10, 20, 10],
	"screens": [
		$DayBackground/Container/AnnounceDead,
		$DayBackground/Container/PlayersGrid,
		$DayBackground/Container/VoteOver
	],
	"command": [
		null, votingStarts, votingResults, null
	]
}

var currentNum: int
var currentSequence: Dictionary
var players: Dictionary
var playerRoles: Dictionary
var acceptVotes: Array
var votes: Dictionary

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

func firstNightSets():
	emit_signal("changeScreen", [], "night")

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
		announceDead.text = players[voteTarget]
		players.erase(voteTarget)
		playerRoles.erase(voteTarget)
		emit_signal("changeScreen", [voteTarget], "death")
	else:
		announceDead.text = "No one is dead"
	nightScreen.visible = false
	dayScreen.visible = true
	emit_signal("changeScreen", [], "morning")
	currentSequence = dayCycle
	currentNum = -1 #After this, curentNum will be incremented by one
	votes = {}

func getRoleId(roles: Array):
	var sendTo: Array = []
	for playerId in playerRoles:
		if playerRoles[playerId] in roles:
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
	acceptVotes = [
		RoleList.CULTIST1, RoleList.CULTIST2, RoleList.SEER, RoleList.SHAMAN, RoleList.VILLAGER
	]

func votingResults():
	emit_signal("changeScreen", [], "end vote")
	acceptVotes = []

func killer1Select():
	acceptVotes = [RoleList.CULTIST1]
	emit_signal("changeScreen", getRoleId([RoleList.CULTIST1]), "killvote")

func killer2Select():
	acceptVotes = [RoleList.CULTIST2]
	emit_signal("changeScreen", getRoleId([RoleList.CULTIST2]), "killvote")

func killersSeeEachother():
	emit_signal("changeScreen", getRoleId([RoleList.CULTIST1, RoleList.CULTIST2]), "look up")

func killersBackToSleep():
	acceptVotes = []
	emit_signal("changeScreen", getRoleId([RoleList.CULTIST1, RoleList.CULTIST2]), "night")

func receiveVote(voteFrom, voteForName):
	if not playerRoles[voteFrom] in acceptVotes:
		print("vote is not accepted from ", players[voteFrom])
	for playerId in players:
		if players[playerId] == voteForName:
			votes[voteFrom] = playerId

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
		timer.start(currentSequence["timers"][currentNum])
	if currentSequence["command"][currentNum] != null:
		currentSequence["command"][currentNum].call()
	currentNum += 1
