/* eslint-disable no-console */
'use strict'
const React = require('react')
const ipfsClient = require('ipfs-http-client')

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      fileHash: null
    }
    this.ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001')

    // bind methods
    this.captureFile = this.captureFile.bind(this)
    this.saveToIpfs = this.saveToIpfs.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  captureFile (event) {
    event.stopPropagation()
    event.preventDefault()
    this.saveToIpfs(event.target.files)
  }

  // Add file to IPFS and return a CID
  async saveToIpfs (files) {
    const source = this.ipfs.add(
      [...files],
      {
        progress: (prog) => console.log(`received: ${prog}`)
      }
    )
    try {
      for await (const file of source) {
        console.log(file)
        this.setState({ fileHash: file.path })
      }
    } catch (err) {
      console.error(err)
    }
  }

  

  handleSubmit (event) {
    event.preventDefault()
  }

  render () {
    return (
      <div>
        <form id='captureMedia' onSubmit={this.handleSubmit}>
          <input type='file' onChange={this.captureFile} /><br/>
        </form>
        <div>
          <a target='_blank'
            href={'https://ipfs.io/ipfs/' + this.state.fileHash}>
            {this.state.fileHash}
          </a>
        </div>
        <img src={'https://ipfs.io/ipfs/' + this.state.fileHash}></img>
      </div>
    )
  }
}
module.exports = App
