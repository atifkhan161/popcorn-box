exports.createServer = function(app, ipcServer){
    const server = ipcServer.createServer(app);

    server.post('/oauth/device/code', (req, res) =>
    {
        // create user, then...
        res.status(200).send(`AAQPZ546c`)
    })
};