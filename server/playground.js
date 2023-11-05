function parseDate(){
	const string = '2012-12-23'
	const date = Date.parse(string)
	const mDate = new Date(date)
	mDate.setHours(23,59,59)

}

parseDate()
