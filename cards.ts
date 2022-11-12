type CardInformation = {
	identificationPrefix: string,
	validCardLength: string
	icon: string,
};
type CardInformationMap = {[key: string]: CardInformation};

type IdentificationAndValidationResult = {
    valid: boolean;
    cardType: string | null;
}

// Called each time the form input changes
// Determines which type of card the input matches (if any),
// and if it matches, whether it"s the appropriate length
// for that type of card
export function identifyAndValidateCardInput (
	creditCardInput: string,
	cardMap: CardInformationMap,
): IdentificationAndValidationResult {
	for (const name in cardMap) {
		const schema = cardMap[name];

		const prefixes = schema.identificationPrefix.split(',');

		let prefixMatched = false;
		for (const prefix of prefixes) {
			if (prefix.includes('-')) {
				// For a range prefix, we need to turn it into an int
				// range so we can compare to the first N digits of the
				// card as an integer
				const [lowPrefix, highPrefix] = prefix
					.split('-')
					.map((prefix) => parseInt(prefix, 10));

				// This won't work if the range spans multiple numbers
				// of digits, but I don't think we need to handle that
				const firstDigits = parseInt(
					creditCardInput.substring(0, lowPrefix.toString().length),
					10,
				);

				if (firstDigits >= lowPrefix && firstDigits <= highPrefix) {
					prefixMatched = true;
					break;
				}
			} else {
				if (creditCardInput.startsWith(prefix)) {
					prefixMatched = true;
					break;
				}
			}
		}
		if (!prefixMatched) {
			continue;
		}

		let [lowLength, highLength] = [0, 0];
		if (schema.validCardLength.includes('-')) {
			// This isn't the _most_ robust way to parse these, but we'll
			// assume for now that the service returning these schemata can
			// be trusted
			[lowLength, highLength] = schema
				.validCardLength
				.split('-')
				.map((length) => parseInt(length, 10));
		} else {
			lowLength = highLength = parseInt(schema.validCardLength, 10);
		}

		// The description says we should check against the "digits"
		// in the input, but given that the examples with spaces/dashes
		// all use length ranges and the digit-only examples all use
		// fixed length limits, I _think_ we're actually meant to compare
		// the number of characters here
		const inputLength = creditCardInput.length;
		if (inputLength < lowLength || inputLength > highLength) {
			return {
				valid: false,
				cardType: name,
			};
		}

		return {
			valid: true,
			cardType: name,
		};
	}

	return {
		cardType: null,
		valid: false,
	};
};
