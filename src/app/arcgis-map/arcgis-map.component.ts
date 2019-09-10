import { Component, OnInit, OnChanges, Output, Input, EventEmitter, ViewChild, ElementRef, HostListener, SimpleChanges } from '@angular/core';
import { loadModules } from 'esri-loader'; 


@Component({
  selector: 'app-arcgis-map',
  templateUrl: './arcgis-map.component.html',
  styleUrls: ['./arcgis-map.component.css']
})
export class ArcgisMapComponent implements OnChanges
{
  @ViewChild('mapDivNode', { static: true }) private mapNodeElementRef: ElementRef;
  @Input()
  public map;
  @Input()
  public layer; 

  events: string[] = [];
  opened: boolean;
  public selectedSource: string;
  public selectedType: string;
  public selectedSourceChoice: string;

  dataSources = [
    { id: 'id1', sourceName: 'US Census' }
  ];
  mapLayerTypes = [
    { id: 'id1', layerType: 'State' },
    { id: 'id2', layerType: 'County' }
  ];

  constructor() { }
  
  changeSources(event) {
    alert("Source -> " + event);
    console.log("Source " + this.selectedSource);

  }
  changeMapLayerType(event) {
    alert("Map Type " + event);
    console.log("Map Type " + this.selectedType);
   
  }

  public yearNum = []; twoThousandChecked; twoThousand7Checked;

  onCheckboxChange(event, value)
  {
    if (event.checked)
    {
      this.yearNum.push(value);
      alert("Year "+ this.yearNum);
    }
    if (!event.checked)
    {
      let index = this.yearNum.indexOf(value);
      if (index > -1) {
        this.yearNum.splice(index, 1);
      }
    }
    
    console.log("Checked List " + this.yearNum);
  }

  

  ngOnChanges(changes: SimpleChanges) 
  {
    console.log(changes);
    const options = { version: '3.28', css: true };
    
    //const map; 
    loadModules([
      'esri/map',
      'esri/layers/ArcGISDynamicMapServiceLayer',
      'esri/symbols/SimpleFillSymbol',
      'esri/symbols/SimpleLineSymbol',
      'esri/Color',
      'esri/tasks/query',
      'esri/tasks/QueryTask',
      'esri/dijit/Legend',
      'esri/dijit/HomeButton'
    ], options)
      .then(([
        Map,
        ArcGISDynamicMapServiceLayer,
        SimpleFillSymbol,
        SimpleLineSymbol,
        Color,
        Query,
        QueryTask,
        Legend,
        HomeButton
      ]) => {
        this.map = new Map(this.mapNodeElementRef.nativeElement, {
          center: [-98.549, 38.947],
          zoom: 4,
          basemap: 'gray-vector',
          logo: false,
          sliderPosition: "top-right",
        });
        // var home = new HomeButton({
        //   map: map
        // }, "HomeButton");
        // home.startup();
        var map2 = this.map;

        this.layer = new ArcGISDynamicMapServiceLayer('https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer', {});
        var layer2 = this.layer;
      
        
        //This is where the users choices dictates which layer to display
        if(this.selectedSource === 'id1' && this.selectedType === 'id1')
        {
          document.getElementById("year2000").addEventListener("click", function (e) {
            map2.removeAllLayers();
            layer2.setVisibleLayers([3]);
            map2.addLayer(layer2);
            console.log(changes);
            console.log("SOMETHING");
          })
          console.log(changes);
          console.log("SOMETHING");
        }
        else if(this.selectedSource === 'id1' && this.selectedType === 'id2')
        {
          map2.removeAllLayers();
          layer2.setVisibleLayers([2]);
          map2.addLayer(layer2);
          console.log(changes);
          console.log("SOMETHING");
        }
        else if(this.selectedSource === 'id1' && this.selectedType === 'id2' && this.yearNum[0]){
          map2.removeAllLayers();
          layer2.setVisibleLayers([2]); //add layer that only show the population for the year 2000
          map2.addLayer(layer2);
          console.log(changes);
          console.log("SOMETHING");
        }
        else
        {
          //display the basemap 
        }

        map2.on('click', event =>
        {
          const query = new Query();
          query.outFields = ['*'];
          query.returnGeometry = true;
          query.geometry = event.mapPoint;

          const queryTask = new QueryTask('https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2');
          queryTask.execute(query, featureSet => {
            if (featureSet.features[0]) {
              map2.graphics.clear();
              const feature = featureSet.features[0];

              const mySymbol = new SimpleFillSymbol('none',
                new SimpleLineSymbol('solid', new Color([255, 0, 0]), 2.5), new Color([0, 0, 0, 0.25])
              );

              feature.setSymbol(mySymbol);
              map2.graphics.add(feature);
            }
          });
        });
        map2.on('load', function () {
          //map.disableScrollWheel();//disable the mouse-wheel  scrolling 
          //map.disablePinchZoom();
          //map.disableMapNavigation();

        });


      })
      .catch(err => {
        console.error(err);
      });
  }


}