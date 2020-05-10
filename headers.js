class HeaderComponent extends HTMLElement {
  css = `
    <style>
      .headers {
        display: flex;
        align-items: center;
      }
      .headers * {
        flex: 1;
        border: 1px solid black;
        padding: 10px;
        text-align: center;
        color: white;
        font-weight: bold;
        font-family: sans-serif;
      }
    </style>
  `
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
  }
  set titles(titles = []) {
    const header = document.createElement('div')
    header.className = 'headers'
    header.innerHTML = this.css
    titles.forEach(title => {
      const span = document.createElement('span')
      span.innerHTML = title
      header.appendChild(span)
    })
    this.root.appendChild(header);
  }
}

customElements.define('header-component', HeaderComponent)
