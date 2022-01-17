import {Button, Row} from "react-bootstrap";

import  {Action_Type,Status_Type} from "../common/Constant";

const  Contract = ({name,symbole,balance,loading,contactBalHandler,contactMintHandler, actionType, CONTACT_ADDRESS})=>{
    return (<><h4>{name} : <a target='_blank'rel="noreferrer" href={`https://ropsten.etherscan.io/address/${CONTACT_ADDRESS}`}>{CONTACT_ADDRESS}</a></h4>
    <h4>{symbole}: <a target='_blank' rel="noreferrer" href={`https://ropsten.etherscan.io/token/${CONTACT_ADDRESS}`}>{CONTACT_ADDRESS}</a></h4>
    <div><span><b>Current Balance :</b> {balance}</span></div>
    <Row className="customRow align-items-center justify-content-center" >
        {loading.actionType === actionType && loading.message ? <span style={loading.status == Status_Type.ERROR ? {color: 'red'} : {}} dangerouslySetInnerHTML={{__html: loading.message}}></span>:''}
        {/*{loading.actionType === actionType && loading.message && loading.status == Status_Type.ERROR ? <span style={{color:'red'}} dangerouslySetInnerHTML={{__html: loading.message}}></span>:''}*/}
        <Button size="lg" disabled={loading.actionType === actionType && loading.status === Status_Type.PENDING} variant="primary" onClick={contactMintHandler} > Mint NFT</Button>
        <Button size="lg" variant="primary" onClick={contactBalHandler}>Check Balance</Button>
    </Row >
    </>
    )
}

export  default  Contract;