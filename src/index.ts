
const port:80 = 80;

import {app} from "./settings";

app.listen(port, ():void=>{
    console.log(`app start on port ${port}`);
    console.log(`open in browser http://localhost:${port}`);
})

