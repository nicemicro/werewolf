extends MarginContainer

enum RoleList {
	VILLAGER,
	CULTIST1,
	CULTIST2,
	SEER,
	SHAMAN
}

var players: Dictionary
var playerRoles: Dictionary

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
