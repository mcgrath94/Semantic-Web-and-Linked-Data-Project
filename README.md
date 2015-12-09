# Semantic-Web-and-Linked-Data-Project
API Project

** by Niall McGrath **

#### Intro
This is an API I created which allows you to query 2 datasets about how many households own a car and how people travel to work/ school or college. I think this will show people that almost every household has a car and will show how different areas travel to work, college or school.

#### Datasets used
The first dataset I used is one which shows household cars and can be found here:  http://data.cso.ie/datasets/households-cars.html
This dataset gives the area, area type (for example cty for county), number of cars per household, and the number of households with this amount of cars.

The second deals with how people commute and can be found here:
http://data.cso.ie/datasets/population-commuting-means.html
This dataset gives the area, area type, means of travel, and the number of people which use this means of travel.

#### How to Query the API

#### N.B It is essential to include the area or other variable with quotes to make this work, (e.g localhost:8008/houseCars/"Cavan"/"4+")

##### Means of Travel
A user can seach for the means of travel used in all area by searching localhost:8008/travMeans. A user can seach for the means of travel used in a particular area by searching localhost:8008/travMeans/"area" where area is eg Cavan.  A user can seach for the means of travel used in a particular area and by a particualar means by searching localhost:8008/travMeans/"area"/"means" where area is eg "Cavan" and means is for e.g "On foot". This result would return the following;
{
		"areacode": "C32",
		"areatype": "CTY",
		"area": "Cavan",
		"traveltype": "On foot",
		"numpeople": 3880
}	

##### Cars per household
A user can seach for cars per household in all areas by searching localhost:8008/householdCars. A user can seach for the number of household cars in a particular area by searching localhost:8008/houseCars/"area" where area is eg Cavan.  A user can seach for the cars per household used in a particular area and by a particualar amount of cars by searching localhost:8008/houseCars/"area"/"x" where area is eg "Mayo" and x is for e.g "4+". This would return the following;
{
		"areacode1": "C29",
		"areatype1": "CTY",
		"area1": "Mayo",
		"numcars": "4+",
		"numhouses": 1011
	}

##### Searching both databases
A user can seach for a combination of these tables by searching localhost:8008/both/area/traveltype and localhost:8008/both/area/traveltype using the same examples given already.


#### Example use of the API
This allows a user to look at information on each area and compare the travel means and number of cars per househpold in an area.  A person could use this to find out what areas people are more likely to have cars or how people commute. Somebody could then use this for example to see if there was an opportunity for a bus service in an area.  


