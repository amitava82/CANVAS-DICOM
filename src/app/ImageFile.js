function ImageFile(arrayBuffer, headers){
    if(arguments.length < 2) throw new Error('Expected 2 arguments but received ' + arguments.length);
    
    this.pixelData = new Uint16Array(arrayBuffer);
    this.IUID = headers.IUID;
    this.BITSALLOCATED = headers.BITSALLOCATED;
    this.BITSSTORED = headers.BITSSTORED;
    this.width = headers.COLUMNS;
    this.height = headers.ROWS;
    this.imageNumber = headers.INSTANCENUMBER;
    this.PS = headers.PS ? headers.PS.split(',') : undefined;
    this.RI = headers.RI;
    this.RS = headers.RS;
    this.windowCenter = headers.WC;
    this.windowWidth = headers.WW;
}

