import React, { useState } from 'react';
import { Stack, Typography, Link } from '@mui/material';
import Container from '../Container';
import { CodeInputField, ConnectWalletBtn, SubmitBtn } from './styles';
import CompleteIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import { useWeb3React } from '@web3-react/core';
import { connect } from '../../web3/connect';
import { getFtx, setFtx } from '../../services/api/ftx';
import { useAppContext } from '../../context/AppContext';
import { reduceHexAddress } from '../../services/common';

const FTXHoldersPageContainer: React.FC = (): JSX.Element => {
    const { active, account, library, activate } = useWeb3React();
    const [appState, setAppState] = useAppContext();
    const [ftxInfo, setFtxInfo] = useState<any>();
    const [code, setCode] = useState<string>('');

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    };

    const onSubmit = () => {
        if (!account) return;

        setFtx(account, code, appState.jwtToken)
            .then((response: any) => {
                console.log('resonse:', response);
            })
            .catch((error) => {
                console.log('error:', error);
            });
    };

    React.useEffect(() => {
        async function updateAppState() {
            if (!account) return;

            const response = await getFtx(account);
            if (response !== '') setFtxInfo(response);
        }

        updateAppState();
    }, [account]);

    return (
        <Container sx={{ paddingY: 8 }}>
            <Stack width={600} spacing={3}>
                <Typography fontSize={48} fontWeight={800} className="neueplak_condensed">
                    FTX 2974 HOLDERS
                </Typography>
                <Typography>
                    All FTX 2974 Holders can join the NF3 mintlist by inputting a given code into the box below.
                </Typography>
                <Stack spacing={3} padding={4} borderRadius={4} sx={{ background: '#1B1C22BF' }}>
                    <Typography fontSize={32} fontWeight={800} className="neueplak_condensed">
                        JOIN NF3 MINTLIST
                    </Typography>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        borderRadius={8}
                        paddingX={2}
                        paddingY={1}
                        sx={{ background: '#32343F' }}
                    >
                        <Typography>MY WALLET ADDRESS:</Typography>
                        <Typography fontWeight={800}>
                            {account ? reduceHexAddress(account, 4) : 'Wallet not connected'}
                        </Typography>
                    </Stack>
                    <Stack spacing={1}>
                        <Typography fontSize={14}>Enter Code</Typography>
                        <CodeInputField value={code} onChange={handleCodeChange} />
                    </Stack>
                    <Stack spacing={3}>
                        {account ? (
                            <>
                                <SubmitBtn onClick={onSubmit}>SUBMIT</SubmitBtn>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    padding={2}
                                    borderRadius={1}
                                    sx={{ background: '#EDF7ED' }}
                                >
                                    <CompleteIcon sx={{ marginTop: 0.5, color: '#4CAF50' }} />
                                    <Stack>
                                        <Typography fontWeight={700} color="#1E4620">
                                            You have successfully joined the Mintlist.
                                        </Typography>
                                        <Typography fontSize={14} fontWeight={500} color="#1E4620">
                                            You have 1 Mintlist spot. Mint your NF3 Basketball in the Curry Shop.
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    padding={2}
                                    borderRadius={1}
                                    sx={{ background: '#FEECEB' }}
                                >
                                    <ErrorIcon sx={{ marginTop: 0.5, color: '#F44336' }} />
                                    <Stack>
                                        <Typography fontWeight={700} color="#621B16">
                                            Error
                                        </Typography>
                                        <Typography fontSize={14} fontWeight={500} color="#621B16">
                                            You have entered an invalid code. Please try again.
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </>
                        ) : (
                            <ConnectWalletBtn onClick={() => connect(activate)}>CONNECT WALLET</ConnectWalletBtn>
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
};

export default FTXHoldersPageContainer;
