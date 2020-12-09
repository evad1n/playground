function findOdd(arr) {
	return arr.find((item, index) => arr.filter(el => el == item).length % 2);
}

function dirReduc(arr) {
	var str = arr.join(''), pattern = /NORTHSOUTH|EASTWEST|SOUTHNORTH|WESTEAST/;
	while (pattern.test(str)) str = str.replace(pattern, '');
	return str.match(/(NORTH|SOUTH|EAST|WEST)/g) || [];
}

function dirReduc(plan) {
	var opposite = {
		'NORTH': 'SOUTH', 'EAST': 'WEST', 'SOUTH': 'NORTH', 'WEST': 'EAST'
	};
	return plan.reduce(function (dirs, dir) {
		if (dirs[dirs.length - 1] === opposite[dir])
			dirs.pop();
		else
			dirs.push(dir);
		return dirs;
	}, []);
}

// var a = [1, 2, 3, 5, 5, 5, 1, 2, 3];

// console.log(findOdd(a));

// console.log(a.find((item) => item % 3 == 0));

function exists(list, el) {
	for (const l of list) {
		if (l.id == el.id)
			return true;
	}
	return false;
}

a = [{ id: 5 }, { id: 2 }];

console.log(exists(a, { id: 5 }));

async function wait(time, ret) {
	let promise = new Promise((resolve, reject) => {
		setTimeout(() => {
			try {
				resolve(ret);
			} catch (error) {
				reject(error);
			}
		}, time);
	});

	let result = await promise;

	console.log(result);
}

wait(1000, 420);