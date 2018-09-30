window.onload = function () {
	let start;
	let end;
	let currency = $("#currency").val();
	let myChart = null;

	$("#get-data").on("click", e => {
		e.preventDefault();

		start = $("#from").val();
		end = $("#to").val();
		currency = $("#currency").val();

		getData(start, end, currency).then(res => printTheChart(res));
		getData(start, end, currency).then(res => minAndMax(res));
	});

	const getData = (start, end, currency) => {
		let url = 'http://api.coindesk.com/v1/bpi/historical/close.json';

		if (start && start !== '' && end && end !== '') {
			if (compareDates(start, end)) {
				url += `${url}?start=${start}&end=${end}&currency=${currency}`;
			}
		} else {
			url += `${url}?currency=${currency}`;
		}

		return axios.get(url)
			.then(res => {
				return {
					bpi: res.data.bpi
				};
			})
			.catch(e => console.log(e));
	};

	getData(start, end, currency).then(res => printTheChart(res));
	getData(start, end, currency).then(res => minAndMax(res));

	let ctx = document.getElementById("myChart").getContext("2d");

	const printTheChart = res => {
		let x = Object.keys(res.bpi);
		let y = Object.values(res.bpi);
		setInputDates(x);

		if (myChart !== null) {
			//To avoid painting multiple iframes into the html
			myChart.destroy();
		}

		myChart = new Chart(ctx, {
			type: "line",
			data: {
				labels: x,
				datasets: [{
					label: "BitCoin Chart",
					backgroundColor: "rgb(255, 99, 132)",
					borderColor: "rgb(255, 99, 132)",
					data: y
				}]
			}
		});
	};

	const setInputDates = (x) => {
		if (start === undefined && end === undefined) {
			$("#from").val(x[0]);
			$("#to").val(x[x.length-1]);
		}
	}
	
	const compareDates = (fromDate, toDate) => {
		return new Date(fromDate) < new Date(toDate);
	};

	const minAndMax = res => {
		let max = Math.max.apply(0, Object.values(res.bpi));
		let min = Math.min.apply(0, Object.values(res.bpi));
		$("#max").text(`${max} ${currency}`);
		$("#min").text(`${min} ${currency}`);
	};
};