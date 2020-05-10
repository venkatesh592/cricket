class BatsMen extends HTMLElement {
  css = `
    <style>
      .batsmen-row {
        display: flex;
        align-items: center;
      }
      .batsmen-row * {
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
    const { name, batting } = player
    const fours = batting.runs.filter(run => run === 4).length
    const sixes = batting.runs.filter(run => run === 6).length
    const content = `
      ${this.css}
      <div class="batsmen-row">
        <span class="name">${name}</span>
        <span class="runs">${batting.score}</span>
        <span class="balls">${batting.balls}</span>
        <span class="balls">${fours}</span>
        <span class="balls">${sixes}</span>
        <span class="balls">${batting.outBy}</span>
      </div>
    `
    this.root.innerHTML = content;
  }
}

customElements.define('batsmen-info', BatsMen)
