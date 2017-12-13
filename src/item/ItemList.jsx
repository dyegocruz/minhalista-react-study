import React, { Component } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import Input from '../common/form/Input'
import Button from '../common/form/Button'

const BASE_URL = 'http://localhost:5001/api'

class ItemList extends Component {
    constructor(props) {
        super(props)

        this.state = { list: [], stateChanged: false }
    }    

    componentWillMount() {
        this.getList()
    }

    getList() {
        axios.get(`${BASE_URL}/ApiItems`)
            .then(resp => {
                this.setState({ list: resp.data })                
            })
            .catch(e => {                
                toast.error("Não foi possível acessar os dados, favor tentar novamente mais tarde.")
            })
    }

    submit(values, method) {        
        const { list } = this.state        
        const id = values.id ? values.id : ''
        axios[method](`${BASE_URL}/ApiItems/${id}`, values)
            .then(resp => {                
                let msg = ''
                let typeMsg = 'success'
                switch (method) {
                    case 'post':
                        msg = 'inserido'                        
                        list[values.index].id = resp.data.id
                        break
                    case 'put':
                        msg = 'atualizado'
                        break
                    case 'delete':
                        msg = 'removido'
                        typeMsg = 'error'
                        break
                    default:
                        break
                }                

                toast[typeMsg](`Item ${msg} com sucesso!`)
            })
            .catch(e => {
                toast.error('Não foi possível realizar a operação')
            })
        
        if (method === 'post')
            this.setState({list})
    }

    updateListState = obj => (element) => {
        const { list } = this.state
        list.map(i => {

            if (i.id === obj.id) {
                if (element.target.type === 'text') {
                    i.nome = element.target.value
                }

                if (element.target.type === 'checkbox') {
                    i.checked = element.target.checked
                    this.submit(i, 'put')
                }
            }
            return i;
        })

        this.setState({
            list,
            stateChanged: true
        })
    }

    addLine() {
        const { list } = this.state                
        list.push({nome: '', checked: false})
        this.setState({list})
    }

    removeLine(item, index) {
        const { list } = this.state

        if (list.length > 1) {
            if (item.id !== undefined) {
                this.submit(item, 'delete')
            }
                        
            list.splice(index, 1)
            this.setState({list})
        } else {
            toast.error('Não é possível excluir este item.')
        }
    }

    handlePostPut(item, index) {
        item.index = index
        
        if (item.id !== undefined) {
            const { stateChanged } = this.state
            if (stateChanged) {
                this.submit(item, 'put')
                this.setState({ stateChanged: false })
            }
        } else {            
            if (item.nome !== '') {
                this.submit(item, 'post')
            }
        }
    }

    renderRows() {
        const list = this.state.list || []
        return list.map((item, index) => (
            <tr className={"tr_clone row" + (item.checked ? ' item-checked' : '')} key={index}>
                <td>  
                    <Input 
                        readOnly={false}
                        type="checkbox"
                        name={"input_check_" + item.id}
                        checked={item.checked}
                        value={item.checked}
                        onChange={this.updateListState(item)} />
                    <Input
                        readOnly={false}
                        type="text"      
                        name={"input_text_" + item.id}
                        value={item.nome}
                        onChange={this.updateListState(item)}
                        onBlur={() => this.handlePostPut(item, index)}
                        />
                    <Button 
                        className="add btn btn-primary btn-sm"
                        onClick={() => this.addLine()}>
                        <span className="glyphicon glyphicon-plus"></span>
                    </Button>
                    <Button 
                        className="remove btn btn-danger btn-sm"
                        onClick={() => this.removeLine(item, index)}>
                        <span className="glyphicon glyphicon-minus"></span>
                    </Button>                                        
                </td>
            </tr>
        ))
    }

    render() {
        return (
            
            <div>
                <ToastContainer autoClose={5000} />             
                <table className="table">
                    <tbody>        
                        {this.renderRows()}
                    </tbody>
                </table>                
            </div>
        )
    }
}

export default ItemList