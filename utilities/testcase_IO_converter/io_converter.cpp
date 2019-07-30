/**
 * Test Case IO Converter
 * Paste in the data, and get it converted to be used in the questions.json
 * Input string "thomas" to stop
 */
 
/*
 Sample format
 
        "testCases": {
            "numTestCases": "1",
            "input": [
                "5\n1 1/1\n2 1/3\n3 5/2\n4 2178309/1346269\n5 1/10000000\n"
            ],
            "output": [
                "1 1/2\n2 3/2\n3 2/5\n4 1346269/1860498\n5 10000000/9999999\n"
			],
			"desc": [
			]
        },
*/

#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
	ios::sync_with_stdio(false); cin.tie(NULL); cout.tie(NULL);
	
	string inputString;
	vector<string> vect;
	
	while (1) {
		cin >> inputString;
		vect.push_back(inputString);
		if (inputString == "thomas") break;
	}
	
	cout << "				\"";
	for (int i = 0; i < vect.size(); i++) {
		cout << vect.at(i) << "\\n";
		
	}
	cout << "\"";
	
	return 0;
}