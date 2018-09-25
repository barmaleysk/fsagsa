const authe = (res, req, next )=>{

if(req.body.login === 'admin' && req.body.password ===''){
	next()
}
res.status(403)

}