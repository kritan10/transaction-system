function myFunc() {
	throw new Error("this is error")
}

function myFuncTwo() {
	return new Promise((resolve, reject) => {
		resolve('Done');
	});
}

async function main() {
	try {
        const a = await myFuncTwo()
        console.log(a);
		await myFunc();
	} catch (error) {
		console.log(error.message);
	}
}

main();
