// eslint-disable-next-line no-unused-vars
const projectName = 'learn-bar-chart';


let width = 800, height = 400, barWidth = width / 275;

const tooltip=d3.select(".visHolder")
                  .append("div")
                  .attr("id","tooltip")
                  .style("opacity","0")

const svgContainer = d3.select('.visHolder')
                .append('svg')
                .attr('width', width + 100)
                .attr('height', height + 60);
 
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
        .then((data)=>{
            svgContainer.append("text")
                .attr("x","-200")
                .attr("y","80") 
                .attr("transform","rotate(-90)") 
                .text("Gross Domestic Product")
  
            svgContainer.append("text")
                .attr("x",width/2+50)
                .attr("y",height+50) 
                .attr("class","fetchUrl") 
                .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
    
    const years=data.data.map((item)=>{
      let quad, temp = item[0].substring(5, 7);
      
      temp==="01"?
          quarter = 'Q1'
      :
      temp==="04"?
          quarter = 'Q2'
      :
      temp==="07"?
          quarter = 'Q3'
      :
      temp==="10" ?
          quarter = 'Q4'
      :quarter
      
      return item[0].substring(0, 4) + ' ' + quarter;
      
    })
    
    const yearsDate = data.data.map( (item)=> {
      return new Date(item[0]);
    });
  
    let xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);
  
    const xMin = new Date(d3.min(yearsDate));

    let xScale = d3.scaleTime()
            .domain([xMin, xMax])
            .range([0, width]);

  
    let xAxis = d3.axisBottom().scale(xScale);
    
  
    svgContainer.append("g")
              .call(xAxis)
              .attr("id","x-axis")
              .attr("transform",'translate(60,400)')
  
    const GDP = data.data.map((item)=> {
      return item[1];
    });
  
    const gdpMax = d3.max(GDP);
    const gdpMin = 0
  
    const yScale= d3.scaleLinear()
                .domain([gdpMin,gdpMax])
                .range([0,height])

    let yAxis = d3.axisLeft(d3.scaleLinear()   //I changed this from the bar default 
                .domain([gdpMin,gdpMax])
                .range([height,0]))

    const scaledGDP = GDP.map( (item)=> {
      return yScale(item);
    });   
    
  
    svgContainer.append("g")
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(60, 0)');
  
     d3.select("svg")
        .selectAll('rect')
        .data(scaledGDP)
        .enter()
        .append("rect")
        .attr("data-date",(d,i)=>{
           return data.data[i][0]
          
        })
        .attr("data-gdp",(d,i)=>{
           return data.data[i][1]
        })
        .attr("x",(d,i)=>{return xScale(yearsDate[i])})
        .attr("y",(d,i)=>{return height-d})
        .attr("class","bar")
        .attr("width",barWidth+.4)
        .attr("height",(d,i)=>{return d})
        .attr("index",(d,i)=>{return i})
        .attr('transform', 'translate(60, 0)')
        .on('mouseover', function(e, d) {
//             d is bar heigth
               let i = this.getAttribute('index');
              
               tooltip.transition().duration(200).style('opacity', 0.9);
               tooltip.html(years[i] +'<br>' +'$' +
                GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
                ' Billion'
               ).attr("data-date",data.data[i][0])
       
                
        })
        .on("mousemove", (e)=>{
            return tooltip.style("top", (e.pageY/2)+"px").style("left",(e.pageX/2)+"px");
        })
        .on("mouseout", ()=>{
                tooltip.transition()
                        .duration(400)
                        .style("opacity", 0);
        })
        
}).catch((e) => console.log(e));

  
  

