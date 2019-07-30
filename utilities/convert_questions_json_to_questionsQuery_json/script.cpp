/**
 * Converts questions.json to questionsList.json
 * Notably this is meant to cut down on unneeded info in questions.json
 * questionsList.json is meant to be fetched when querying for questions in a list
 * questionsList.json format:
 * 
 * {
        "problem": "0-1 Sequences",
		"problemID": "sequences",
		"difficulty": "6.6",
		"category": ""
    },
	
 * remember to remove trailing ',' at the end of the last item in the json file
 */

#include<bits/stdc++.h> 
using namespace std;

int main(){
	string inputString;
	
	vector<string> vect;
	while (1) {
		getline(cin, inputString);
		if (inputString.find("\"problemID\"") != string::npos) {
			//put to lowercase
			inputString = inputString.substr(25);
			for (int i = 0; i < inputString.size(); i++) {
				if (inputString.at(i) >= 65 && inputString.at(i) <= 90) {
					inputString.at(i) += 32;
				}
				
			}
			vect.push_back(inputString);
		}
		
		if (inputString == "0") break;
	}
	
	cout << "[\n";
		for (int j = 0; j < vect.size(); j++) {
		cout << "	" << vect.at(j) << "\n";
	}
	
	cout << "]";
	
	return 0;
}