import { Stack } from '@mui/material'
import TextField from '@mui/material/TextField';
import {Button} from '@mui/material'
import { useState } from 'react'
import BorderBar from './progress';
const Home=()=>{
    const [tokenPrice , setTokenPrice] = useState(1000)
    const [totalToken , setTotalToken] = useState(1000000)
    const [tokenBought , setTokenBough] = useState(0)
    return(
        <div className="App" style={{border:'1px solid' , borderRadius:20 , padding:30}}>
        <h1>Deep Token Sale</h1>
        <Stack>
            <h4>Introducing Deep Token (Deep)!
            <br></br>Token Price {tokenPrice} Ether</h4>
            <Stack direction={'row'}>
                <TextField sx={{ margin:'auto'}} fullWidth />
                <Button sx={{backgroundColor:'purple' , color:'white'}}>Buy Token</Button>
            </Stack>
                <br></br>
            <div style={{marginTop:10}}>
                <BorderBar val={tokenBought/totalToken}  />
                <h4>Token Sold So far {tokenBought} / {totalToken} </h4>
            </div>
            
        </Stack>
        
    </div>
    )
}
export default Home;