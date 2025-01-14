// @flow

import * as React from 'react';
import styled, { css, keyframes } from 'styled-components';

import QRCode from 'qrcode.react';

import { type ButtonStates } from '../../hoc/BadgerBase';
import colors from '../../styles/colors';

import CheckSVG from '../../images/CheckSVG';
import LoadSVG from '../../images/LoadSVG';

import Text from '../Text';

// May not need this wrapper.
const Wrapper = styled.div`
	display: inline-block;
`;

const Main = styled.div`
	display: grid;
	position: relative;
`;

const QRCodeWrapper = styled.div`
	padding: 12px 12px 9px;
	border: 1px solid ${colors.fg500};
	border-radius: 5px 5px 0 0;
	border-bottom: none;
	background-color: white;
`;

const A = styled.a`
	color: inherit;
	text-decoration: none;
`;

const ButtonElement = styled.button`
	cursor: pointer;
	border: none;
	position: relative;
	border-radius: 0 0 5px 5px;
	outline: none;
	background-color: ${colors.brand500};
	border-right: 1px solid ${colors.fg500};
	border-left: 1px solid ${colors.fg500};
	border-bottom: 1px solid ${colors.fg500};
	padding: 12px 20px;
	color: ${colors.bg100};
	&:hover {
		background-color: ${colors.brand500};
		color: ${colors.bg100};
	}
	&:active {
		background-color: ${colors.brand700};
		color: ${colors.bg100};
	}
`;

const cover = css`
	position: absolute;
	border-radius: 0 0 5px 5px;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	font-size: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1;
`;

const PendingCover = styled.div`
	${cover};
	border: 1px solid ${colors.pending700};
	border-radius: 5px;
	background-color: ${colors.pending500};
`;

const CompleteCover = styled.div`
	${cover};
	border-radius: 5px;
	border: 1px solid ${colors.success700};
	background-color: ${colors.success500};
`;

const LoginCover = styled.div`
	${cover};
	font-size: 16px;
	border-color: ${colors.pending700};
	background-color: ${colors.pending500};
`;

const WarningCover = styled.div`
	${cover};
	font-size: 16px;
	border-color: ${colors.brand700};
	background-color: ${colors.brand500};
	cursor: pointer;
	&:active {
		background-color: ${colors.brand700};
		color: ${colors.bg100};
	}
`;

const spinAnimation = keyframes`
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
}
`;
const CheckContainer = styled.div``;

const PendingSpinner = styled.div`
	animation: ${spinAnimation} 3s linear infinite;
	display: flex;
	align-items: center;
	justify-content: center;
`;

type Props = {
	step: ButtonStates,
	children: React.Node,
	toAddress: string,
	amountSatoshis: ?number,
	sizeQR: number,
};

class ButtonQR extends React.PureComponent<Props> {
	static defaultProps = {
		sizeQR: 125,
	};

	render() {
		const { children, step, toAddress, amountSatoshis, sizeQR } = this.props;

		const widthQR = sizeQR >= 125 ? sizeQR : 125; // Minimum width 125

		// QR code source
		const uriBase = toAddress;

		const uri = amountSatoshis
			? `${uriBase}?amount=${amountSatoshis / 1e8}`
			: uriBase;

		// State booleans
		const isFresh = step === 'fresh';
		const isPending = step === 'pending';
		const isComplete = step === 'complete';
		const isLogin = step === 'login';
		const isInstall = step === 'install';

		return (
			<Wrapper>
				<Main>
					{isPending && (
						<PendingCover>
							<PendingSpinner>
								<LoadSVG />
							</PendingSpinner>
						</PendingCover>
					)}
					{isComplete && (
						<CompleteCover>
							<CheckSVG />
						</CompleteCover>
					)}

					<QRCodeWrapper>
						<a href={uri}>
							<QRCode value={uri} size={widthQR} />
						</a>
					</QRCodeWrapper>

					<ButtonElement disabled={!isFresh} isFresh={isFresh} {...this.props}>
						{children}

						{isLogin && (
							<LoginCover>
								<Text>Login to Badger</Text>
							</LoginCover>
						)}
						{isInstall && (
							<WarningCover>
								<Text>
									<A href="https://badger.bitcoin.com" target="_blank">
										Install Badger & refresh
									</A>
								</Text>
							</WarningCover>
						)}
					</ButtonElement>
				</Main>
			</Wrapper>
		);
	}
}

export default ButtonQR;
