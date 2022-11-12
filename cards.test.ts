import {describe, expect, test} from '@jest/globals';
import {identifyAndValidateCardInput} from './cards';

describe('identifyAndValidateCardInput part 1', () => {
	test('Empty info map always returns invalid', () => {
		expect(identifyAndValidateCardInput('1111 2222 3333 444', {}))
			.toStrictEqual({cardType: null, valid: false});
	});

	test('Given test cases', () => {
		const exampleCards = {
			"visa": {
				identificationPrefix: "4",
				validCardLength: "13-19",
				icon: "https://<link-to-visa-icon>"
			},
			"union-pay": {
				// This was 4 in the description, but I think that was a typo
				identificationPrefix: "6",
				validCardLength: "13-19",
				icon: "https://<link-to-union-pay-icon>"
			}
		};

		const cases = {
			'4784 6842 6842 6756': {
				cardType: "visa",
				valid: true,
			},
			'478468426842': {
				cardType: "visa",
				valid: false,
			},
			'6284-6842-6842-6756': {
				cardType: "union-pay",
				valid: true,
			},
			'6284-6842-6842-6': {
				cardType: "union-pay",
				// This was false in the description, but it is in the
				// given length range
				valid: true,
			},
			'12345': {
				cardType: null,
				valid: false,
			},
		};

		for (const cardNumber in cases) {
			expect(identifyAndValidateCardInput(cardNumber, exampleCards))
				.toStrictEqual(cases[cardNumber]);
		}
	});
});

describe('identifyAndValidateCardInput part 2', () => {
	test('Given test cases', () => {
		const exampleCards = {
			"mastercard": {
				identificationPrefix: "51-55,222100-272099",
				validCardLength: "16",
				icon: "https://<link-to-mastercard-icon>"
			},
			"diners-club-carte-blanche": {
				identificationPrefix: "300-305",
				validCardLength: "14",
			},
		};

		const cases = {
			'30342495436454': {
				cardType: "diners-club-carte-blanche",
				valid: true,
			},
			// In the given example this was 16 digits long, I added
			// one to get it to fail
			'25235792129212555': {
				cardType: "mastercard",
				valid: false,
			},
			'5392129212921255': {
				cardType: "mastercard",
				valid: true,
			},
			'5692129212921255': {
				cardType: null,
				valid: false,
			},
		};

		for (const cardNumber in cases) {
			expect(identifyAndValidateCardInput(cardNumber, exampleCards))
				.toStrictEqual(cases[cardNumber]);
		}
	});
});
