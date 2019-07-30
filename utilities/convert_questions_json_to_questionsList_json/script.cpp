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
	
 * remember to remove trailing ',' at the end of the last item
 */

#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main(){
	string inputString;
	
	vector<string> vect;
	while (1) {
		getline(cin, inputString);
		if (inputString.find("\"problem\"") != string::npos) {
			vect.push_back(inputString);
		} else if (inputString.find("\"problemID\"") != string::npos) {
			vect.push_back(inputString);
		} else if (inputString.find("\"difficulty\"") != string::npos) {
			vect.push_back(inputString);
		} else if (inputString.find("\"category\"") != string::npos) {
			vect.push_back(inputString);
		}
		
		
		if (inputString == "0") break;
	}
	
	cout << "[\n";
	for (int i = 0; i < vect.size(); i += 4) {
		cout << "	{\n";
		cout << "" << vect.at(i) << "\n";
		cout << "" << vect.at(i + 1) << "\n";
		cout << "" << vect.at(i + 2) << ",\n";
		cout << "" << vect.at(i + 3) << "\n";
		
		cout << "	},\n";
	}
	
	cout << "]";
	
	return 0;
}