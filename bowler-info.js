class Bowler extends HTMLElement {
  css = `
    <style>
      .row {
        display: flex;
        align-items: center;
      }
      .row * {
        flex: 1;
        text-align: center;
        border: 1px solid;
        padding: 10px;
        min-height: 20px;
      }
    </style>
  `
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
  }
  set player(player) {
    const { name, bowling } = player
    const runs = {
      fours: 0,
      sixes: 0,
      zeros: 0,
      wides: 0,
      no_balls: 0
    }
    bowling.runs.forEach(run => {
      if (run === 4) {
        runs.fours += 1
      }
      if (run === 6) {
        runs.sixes += 1
      }
      if (run === 0) {
        runs.zeros += 1
      }
      if (run === WIDE) {
        runs.wides += 1
      }
      if (run === NO_BALL) {
        runs.no_balls += 1
      }
    })

    const content = `
      ${this.css}
      <div class="row">
        <span>${name}</span>
        <span>${bowling.overs}</span>
        <span>${bowling.score}</span>
        <span>${bowling.wickets}</span>
        <span>${runs.zeros}</span>
        <span>${runs.fours}</span>
        <span>${runs.sixes}</span>
        <span>${runs.wides}</span>
        <span>${runs.no_balls}</span>
      </div>
    `
    this.root.innerHTML = content;
  }
}

customElements.define('bowler-info', Bowler)
