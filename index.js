const WIDE = 'wd'
const NO_BALL = 'nb'
const OUT = 'out'
const MAX_OVERS = 20
const MAX_PLAYERS_FOR_TEAM = 11
const MAX_WICKETS = 10

const TIME_GAP = 1000

const scores = [ 0, 1, 2, 3, 4, 5, 6, WIDE, NO_BALL, OUT ]

const TEAM_A_NAME = 'Team A'
const TEAM_B_NAME = 'Team B'

let currentBatting = TEAM_A_NAME
let isGameInProgress = false

// 0th position player is currently doing batting
let batting = [0, 1]
let bowling = 0

let teamA = null
let teamB = null

Array.prototype.max = function() {
  return Math.max.apply(null, this)
}

/**
 * @param {String} label 
 * @returns {HTMLHeadElement}
 * @description Create dynamic h3 element with label
 */
const getheader = (label) => {
  const header = document.createElement('h3')
  header.innerHTML = label
  return header
}

/**
 * @method renderInit
 * @description create initail doms(Tables)
 */
const renderInit = () => {
  const isDomExist = document.querySelector('details-component')
  if(isDomExist) return
  const detailsDashboard = document.getElementById('details')
  const details = document.createElement('details-component')
  detailsDashboard.appendChild(details)

  const batsmensDashboard = document.getElementById('a-batsmen-dashboard')
  batsmensDashboard.appendChild(getheader('Team A Batting'))
  const aHeaders = document.createElement('header-component')
  aHeaders.titles = [ 'Batsmen Name', 'Runs', 'Bowls ', '4s ', '6s', 'Wicket by' ]
  batsmensDashboard.appendChild(aHeaders)
  teamA.players.forEach(player => {
    const batsmen = document.createElement('batsmen-info')
    batsmen.player = player
    batsmensDashboard.appendChild(batsmen)
  })

  const aBowlerDashboard = document.getElementById('a-bowler-dashboard')
  aBowlerDashboard.appendChild(getheader('Team B Bowling'))
  const aBowlersHeader = document.createElement('header-component')
  aBowlersHeader.titles = [ 'Bowler Name', 'Overs', 'Runs', 'Wickets', '0s', '4s', '6s', 'WD', 'NB' ]
  aBowlerDashboard.appendChild(aBowlersHeader)
  teamB.players.forEach(player => {
    const bowler = document.createElement('bowler-info')
    bowler.player = player
    aBowlerDashboard.appendChild(bowler)
  })

  const bBatsmensDashboard = document.getElementById('b-batsmen-dashboard')
  bBatsmensDashboard.appendChild(getheader('Team B Batting'))
  const bHeaders = document.createElement('header-component')
  bHeaders.titles = [ 'Batsmen Name', 'Runs', 'Bowls ', '4s ', '6s', 'Wicket by' ]
  bBatsmensDashboard.appendChild(bHeaders)
  teamB.players.forEach(player => {
    const batsmen = document.createElement('batsmen-info')
    batsmen.player = player
    bBatsmensDashboard.appendChild(batsmen)
  })

  const bBowlerDashboard = document.getElementById('b-bowler-dashboard')
  bBowlerDashboard.appendChild(getheader('Team A Bowling'))
  const bBowlersHeader = document.createElement('header-component')
  bBowlersHeader.titles = [ 'Bowler Name', 'Overs', 'Runs', 'Wickets', '0s', '4s', '6s', 'WD', 'NB' ]
  bBowlerDashboard.appendChild(bBowlersHeader)
  teamA.players.forEach(player => {
    const bowler = document.createElement('bowler-info')
    bowler.player = player
    bBowlerDashboard.appendChild(bowler)
  }) 
}

/**
 * @method getPlayer
 * @param {String} teamName 
 * @param {Number} index 
 * @return {Object} player object 
 */
const getPlayer = (teamName, index) => {
  const player = {
    name: `${teamName} Player ${index + 1}`,
    batting: {
      balls: 0,
      runs: [],
      score: 0,
      outBy: ''
    },
    bowling: {
      balls: 0,
      overs: 0,
      runs: [],
      score: 0,
      wickets: 0
    }
  }
  return player
}

/**
 * @method generatePlayers
 * @description generate 11 players in each Team
 */
const generatePlayers = () => {
  for (let index = 0; index < MAX_PLAYERS_FOR_TEAM; index++) {
    teamA.players.push(getPlayer(TEAM_A_NAME, index))
    teamB.players.push(getPlayer(TEAM_B_NAME, index))
  }
}

/**
 * @method getCurrentBatsMen
 * @returns {Object} current batsmen
 */
const getCurrentBatsMen = () => {
  const { players } = currentBatting === TEAM_A_NAME ? teamA : teamB
  return players[batting[0]]
}

/**
 * @method getCurrentBowler
 * @returns {Object} current bowler
 */
const getCurrentBowler = () => {
  const { players } = currentBatting === TEAM_A_NAME ? teamB : teamA
  return players[bowling]
}

/**
 * @method swapBatsMen
 * @description swap the batsmen when over is finished
 */
const swapBatsMen = () => {
  batting = batting.reverse()
}

/**
 * @method swapBowling
 * @description swap the bowler when over is finished
 */
const swapBowling = () => {
  bowling = ((bowling + 1) % 11)
}

/**
 * @method swapBatting
 * @param {String} teamName
 * @description swap batting between teams
 */
const swapBatting = (teamName) => {
  currentBatting = teamName
  batting = [0, 1]
  bowling = 0
}


/**
 * @method updateNextBatsMen
 * @description remove the batsmen if current batsmen out
 */
const updateNextBatsMen = () => {
  const lastPlayer = batting.max()
  batting[0] = lastPlayer + 1
}

/**
 * @method updateBatting
 * @param {String | Number} score 
 * @description updating score to current batsmen
 */
const updateBatting = (score) => {
  const team = currentBatting === TEAM_A_NAME ? teamA : teamB
  const batsmen = getCurrentBatsMen()
  const bowler = getCurrentBowler()

  if (Number(score)) {
    team.score += score
    batsmen.batting.runs.push(score)
    batsmen.batting.score += score
  }

  // We are consider WIDE and NO_BALL to be 1
  if (score === WIDE || score === NO_BALL) {
    team.score += 1
    return
  }

  team.balls += 1
  batsmen.batting.balls += 1
  team.overs = Math.floor(team.balls / 6)

  if (score === OUT) {
    batsmen.batting.outBy = bowler.name
    team.wickets += 1
    updateNextBatsMen()
  }
}

/**
 * @method updateBowling
 * @param {String | Number} score 
 * @description updating score to current bowler
 */
const updateBowling = (score) => {
  const bowler = getCurrentBowler()
  bowler.bowling.runs.push(score)
  if (Number(score)) {
    bowler.bowling.score += score
  }

  // We are consider WIDE and NO_BALL to be 1
  if (score === WIDE || score === NO_BALL) {
    bowler.bowling.score += 1
    return
  }
  if (score === OUT) {
    bowler.bowling.wickets += 1
  }
  bowler.bowling.balls += 1
  bowler.bowling.overs = Math.floor(bowler.bowling.balls / 6)
}

/**
 * @method updateMatch
 * @description updating match swap batsmen/bowler
 */
const updateMatch = () => {
  const team = currentBatting === TEAM_A_NAME ? teamA : teamB
  // For every over swap the batsmen | bowler
  if (team.balls % 6 === 0) {
    swapBatsMen()
    swapBowling()
  }

  if (currentBatting === TEAM_A_NAME && (teamA.overs === MAX_OVERS || teamA.wickets === MAX_WICKETS)) {
    // set the target for Team B
    teamB.target = teamA.score + 1
    swapBatting(TEAM_B_NAME)
    return
  }
  
  if (currentBatting === TEAM_B_NAME && (teamB.score >= teamB.target || teamB.overs === MAX_OVERS || teamB.wickets === MAX_WICKETS)) {
    stopGame()
    isGameInProgress = false
  }
}

/**
 * @method update
 * @param {String | Number} score 
 * @description update the score in UI. renderer
 */
const update = (score) => {
  updateBatting(score)
  updateBowling(score)
  updateMatch()
  render()
}

/**
 * @method getRandomIndex
 * @param {Number} max 
 * @description generate ramdom score
 */
const getRandomIndex = (max) => {
  return Math.ceil(Math.random() * Math.floor(max));
}

/**
 * @method bowl
 * @description generate ramdom score
 */
const bowl = () => {
  const index = getRandomIndex(scores.length - 1)
  update(scores[index])
}

let intervalId = null

/**
 * @method startGame
 * @description start the game
 */
const startGame = () => {
  if (intervalId === null) {
    intervalId = setInterval(() => {
      bowl()
    }, TIME_GAP)
  }
  const button = document.getElementById('start')
  button.textContent = 'Stop'
  button.classList.toggle("red")
}

/**
 * @method stopGame
 * @description stop the game
 */
const stopGame = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  const button = document.getElementById('start')
  button.textContent = 'Start'
  button.classList.toggle("red")
}

/**
 * @method restart
 * @description restart the GAME
 */
const restart = () => {
  if (isGameInProgress) {
    startGame()
  } else {
    teamA = {
      name: TEAM_A_NAME,
      balls: 0,
      overs: 0,
      runs: 0,
      wickets: 0,
      score: 0,
      players: [],
      extras: 0
    }
    teamB = {
      name: TEAM_B_NAME,
      balls: 0,
      overs: 0,
      runs: 0,
      wickets: 0,
      players: [],
      score: 0,
      target: 0
    }
    generatePlayers()
    renderInit()
    swapBatting(TEAM_A_NAME)
    isGameInProgress = true
    startGame()
  }
}

/**
 * @method startBatting
 * @param {Event} event 
 * @description start/restart/stop the match
 */
const startBatting = ({target}) => {
  if (target.textContent === 'Start') {
    restart()
  } else {
    stopGame()
  }
}

/**
 * Update the tables with latest values
 */
const render = () => {
  const details = document.querySelector('details-component')
  details.a = teamA
  details.b = teamB
  if (isGameInProgress) {
    details.results = `--`
  } else {
    const team = teamB.target <= teamB.score ? 'Team B' : 'Team A'
    details.results = `${team} won the game.`
  }

  const aBatsmensDashboard = document.getElementById('a-batsmen-dashboard')
  const aBatsmens = aBatsmensDashboard.querySelectorAll('batsmen-info')
  const { players: aBatting } = teamA
  aBatsmens.forEach((batsmen, index) => {
    batsmen.player = aBatting[index]
  })

  const aBowlerDashboard = document.getElementById('a-bowler-dashboard')
  const aBowlers = aBowlerDashboard.querySelectorAll('bowler-info')
  const { players: aBowling } = teamB
  aBowlers.forEach((bowler, index) => {
    bowler.player = aBowling[index]
  })

  const bBatsmensDashboard = document.getElementById('b-batsmen-dashboard')
  const bBatsmens = bBatsmensDashboard.querySelectorAll('batsmen-info')
  const { players: bBatting } = teamB
  bBatsmens.forEach((batsmen, index) => {
    batsmen.player = bBatting[index]
  })

  const bBowlerDashboard = document.getElementById('b-bowler-dashboard')
  const bBowlers = bBowlerDashboard.querySelectorAll('bowler-info')
  const { players: bBowling } = teamA
  bBowlers.forEach((bowler, index) => {
    bowler.player = bBowling[index]
  })
}
