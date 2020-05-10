class DetailsComponent extends HTMLElement {
  teamA = document.createElement('div')
  teamB = document.createElement('div')
  result = document.createElement('div')
  css = `
    <style>
      div {
        padding: 10px 0;
      }
    </style>
  `
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = this.css
    this.root.appendChild(this.teamA)
    this.root.appendChild(this.teamB)
    this.root.appendChild(this.result)
  }

  set a (team) {
    const currentOverBalls = team.balls % 6
    this.teamA.innerHTML = `Team A: ${team.score}/${team.wickets}, Overs ${team.overs}.${currentOverBalls}`
  }

  set b (team) {
    const currentOverBalls = team.balls % 6
    this.teamB.innerHTML = `Team B: ${team.score}/${team.wickets}, target ${team.target}, Overs ${team.overs}.${currentOverBalls}`
  }

  set results (result) {
    this.result.innerHTML = result
  }

}

customElements.define('details-component', DetailsComponent)
