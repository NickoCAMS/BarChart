function App() {
  const [gdpData, setGdpData] = React.useState(null);

  React.useEffect(() => {
    async function fetchGDPData() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGdpData(data); // Salva i dati nello stato
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    fetchGDPData();
  }, []);

  React.useEffect(() => {
    if (gdpData) {
      createBarChart(gdpData); // Chiama createBarChart quando i dati sono disponibili
    }
  }, [gdpData]); // Effettua l'operazione solo quando gdpData cambia

  return (
    <div>
      <h1>BarChart</h1>
      {/* Elemento SVG verrà aggiunto dalla funzione createBarChart */}
    </div>
  );
}

function createBarChart(data) {
  const width = 1200;
  const height = 600;
  const padding = 100;

  // Parse the data
  const dataset = data.data;
  const dates = dataset.map(item => new Date(item[0]));
  const gdps = dataset.map(item => item[1]);

  // Create scales
  const xScale = d3.scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([padding, width - padding]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(gdps)])
    .range([height - padding, padding]);

  // Create the SVG container
  const svg = d3.select("#root")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Add title
  svg.append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", padding / 2)
    .attr("text-anchor", "middle")
    .text("GDP Over Time");

  // Create axes
  const xAxis = d3.axisBottom(xScale).ticks(10).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(10).tickSizeOuter(0);

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis)
    .selectAll(".tick");

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis)
    .selectAll(".tick");

    svg.selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(dates[i]))
      .attr("y", d => yScale(d[1]))
      .attr("width", (width - 2 * padding) / dataset.length)
      .attr("height", d => height - padding - yScale(d[1]))
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("fill", "steelblue")
      .on("mouseover", function(event, d) {
        const tooltip = document.getElementById("tooltip");
        tooltip.style.display = "block";
        tooltip.style.left = (event.pageX + 10) + "px";
        tooltip.style.top = (event.pageY - 20) + "px";
        tooltip.innerHTML = `Date: ${d[0]}<br>GDP: ${d[1]}`;
        tooltip.setAttribute("data-date", d[0]);
        d3.select(this).attr("fill", "black");
      })
      .on("mouseout", function() {
        const tooltip = document.getElementById("tooltip");
        tooltip.style.display = "none";
        d3.select(this).attr("fill", "steelblue");
      });
    }


ReactDOM.render(<App />, document.getElementById('root'));

