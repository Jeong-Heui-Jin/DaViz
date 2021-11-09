import React, { useEffect } from 'react';
import AlbumIcon from '@mui/icons-material/Album';
import styled from 'styled-components';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useRecoilState } from 'recoil';
import { useHistory } from 'react-router';
import ScrollHorizontal from 'react-scroll-horizontal';
import axios from 'axios';
import { detailDataState, detailColumnState } from '../recoil/detailAtom';
import DataStatistics from '../components/DataStatistics';
import BoxPlotChart from '../components/charts/BoxPlotChart';
import Histogram from '../components/charts/Histogram';
import SelectColumn from '../components/SelectColumn';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  .top {
    margin-right: 3rem;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 2rem;
  color: #ffffff;
  background-color: #0076be;
  p {
    margin-left: 0.8rem;
    font-size: 1.4rem;
  }
`;

const Between = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #ffffff;
  background-color: #0076be;
  .home {
    color: #ffffff;
    background-color: transparent;
    font-size: 1.5rem;
    margin-right: 2rem;
    cursor: pointer;
  }
  .back {
    color: #ffffff;
    background-color: transparent;
    font-size: 1.5rem;
    margin-right: 0.3rem;
    cursor: pointer;
  }
  .home:hover {
    opacity: 0.5;
  }
  .back:hover {
    opacity: 0.5;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const BoxPlotWrapper = styled.div`
  width: 25%;
  max-width: 30%;
`;
const HistogramWrapper = styled.div`
  width: 25%;
  max-width: 30%;
`;

const GraphWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DSWrapper = styled.div`
  margin-right: 3rem;
`;

// Overall - Column 전환 버튼
function SelectButton({ id }) {
  const history = useHistory();

  return (
    <Buttons>
      <Stack spacing={2} direction="row">
        <Button
          variant="outlined"
          onClick={() => history.push(`/${id}/detail`)}
        >
          Overall
        </Button>
        <Button variant="contained">Column</Button>
      </Stack>
    </Buttons>
  );
}

function DetailColumn({ match }) {
  const history = useHistory();
  const [detailDatas, setDetailDatas] = useRecoilState(detailDataState);
  const [columnNames, setColumnNames] = useRecoilState(detailColumnState);

  const {
    params: { id }
  } = match;

  const goHome = () => {
    history.push('/');
  };

  const goDL = () => {
    history.push('/datalist');
  };

  const getDetailData = () => {
    axios
      .get(`/datasets/${id}/detail`)
      .then((res) => {
        setDetailDatas(res.data);
        console.log(res.data, '찍힘');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDataSets = async () => {
    await axios
      .get(`/datasets/${id}/overall`)
      .then((res) => {
        setColumnNames(res.data.info.columns.split('|'));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDetailData();
    getDataSets();
    return () => {
      setDetailDatas([]);
    };
  }, []);

  return (
    <Wrapper>
      <Between>
        <Title>
          <AlbumIcon />
          <p>{id}</p>
        </Title>
        <Buttons>
          <Button className="back" onClick={goDL}>
            Back
          </Button>
          <Button className="home" onClick={goHome}>
            Home
          </Button>
        </Buttons>
      </Between>
      <Container maxWidth="xl">
        <SelectButton id={id} />
        <h2>Column Detail</h2>
        <SelectColumn namess={columnNames} />
        <div id="scroll-horizontal" style={{ height: `18em` }}>
          <ScrollHorizontal reverseScroll>
            {detailDatas.length >= 1 &&
              detailDatas.map((detailData) => (
                <DSWrapper>
                  <DataStatistics detail={detailData} />
                </DSWrapper>
              ))}
          </ScrollHorizontal>
        </div>
        <hr />
        <GraphWrapper>
          <BoxPlotWrapper>
            <BoxPlotChart />
          </BoxPlotWrapper>
          <HistogramWrapper>
            <Histogram />
          </HistogramWrapper>
          <DataStatistics />
          <DataStatistics />
        </GraphWrapper>
      </Container>
    </Wrapper>
  );
}

export default DetailColumn;
