/**
 * Convert test cases to answers in JSON format
 */
 
#include<bits/stdc++.h> 
using namespace std;

int main() {
	string inputString;
	
	vector<string> vect;
	while (1) {
		getline(cin, inputString);
		if (inputString != "end") {
			vect.push_back(inputString.substr(inputString.find("\"problem\""), string::npos));
		} else {
			break;
		}
		/*
		if (inputString == "end") {
			break;
		}
		vect.push_back(inputString);
		*/
	}
	
	for (int i = 0; i < vect.size(); i++) {
		if (i != (vect.size() - 1)) {
			cout << vect.at(i) << "\n";
			//cout << vect.at(i) << "\\n";
		}
	}
	
	
	return 0;
}