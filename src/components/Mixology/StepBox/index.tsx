import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import Image from 'next/image';
import BasketballImg from '../../../assets/items/basketball.png';
import SerumImg from '../../../assets/items/serum.png';
import FusedImg from '../../../assets/items/fused.png';
import { useAppContext } from '../../../context/AppContext';

type ComponentProps = {
    step: number;
};

const stepsList = [
    { img: BasketballImg, title: 'Select a Basketball' },
    { img: SerumImg, title: 'Select up to 3 Serums' },
    { img: FusedImg, title: 'Fuse to Evolve' },
];

const StepBox: React.FC<ComponentProps> = ({ step }): JSX.Element => {
    const [appState, setAppState] = useAppContext();

    let processed = step <= appState.mixologyCurStep;

    return (
        <Stack
            direction="row"
            alignItems="center"
            padding={2}
            spacing={3}
            borderRadius={2}
            sx={{ background: processed ? '#FFCA21' : '#1B1C22' }}
        >
            <Box width={80} height={80} borderRadius={2} overflow="hidden">
                <Image src={stepsList[step].img} width={80} height={80} alt="" />
            </Box>
            <Stack>
                <Typography fontSize={16} fontWeight={400} color={processed ? 'black' : 'white'}>
                    {`STEP ${step + 1}`}
                </Typography>
                <Typography fontSize={16} fontWeight={700} color={processed ? 'black' : 'white'}>
                    {stepsList[step].title}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default StepBox;