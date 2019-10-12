const electron=require("electron");
const {app, BrowserWindow}=electron;

//per mi hjek security warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;


app.on('ready',()=>{
	let win = new BrowserWindow(
	{
		height:800,
		width:1200,
		frame:true,
		resizable:true,
	});
	//win.setMenu(null);
	win.loadURL("file:///C:/Users/ASUS/Desktop/electronWS/index.html");
	//win.webContents.openDevTools();
})

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
	  app.quit();
	}
});