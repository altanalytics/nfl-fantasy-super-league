# NFL Super Fantasy League

A web application that combines two ESPN fantasy football leagues into one unified "super league" competition. Each team plays both inter-league and cross-league games every week, creating a neighborhood-wide fantasy football experience.

## Overview

This project solves the problem of oversubscribed fantasy leagues by creating a system where two separate ESPN leagues can compete against each other while maintaining their individual standings. The result is 24 teams competing in one super fantasy league with prizes both within leagues and across leagues.

## Features

- **Dual League Integration**: Combines two ESPN fantasy leagues into one unified competition
- **Real-time Scoring**: Updates every 5 minutes during games with live ESPN data
- **Cross-League Matchups**: Each team plays one inter-league game and one cross-league game weekly
- **Live Standings**: Separate tracking for individual league standings and overall super league rankings
- **Prize Structure**: Maintains separate prize pools within leagues plus cross-league competitions

## Tech Stack

- **Frontend**: React with AWS Amplify
- **Backend**: API Gateway for ESPN data integration
- **Storage**: S3 for data persistence
- **Authentication**: Amazon Cognito for secure user access

## How It Works

1. **Data Collection**: Pulls real-time fantasy data from two ESPN leagues every 5 minutes
2. **Matchup Generation**: Creates weekly matchups that include both intra-league and inter-league games
3. **Scoring System**: Calculates scores for both individual league standings and super league rankings
4. **Live Updates**: Provides real-time score updates during NFL games

## Architecture

The application uses AWS Amplify for hosting and deployment, with API Gateway handling ESPN data integration. Real-time scoring is maintained through scheduled data pulls that update S3 storage, which feeds the React frontend for live score displays.

## Getting Started

### Prerequisites
- AWS Account with Amplify access
- ESPN Fantasy League API access for both leagues
- Node.js and npm installed

### Deployment

1. Clone the repository
2. Configure ESPN league credentials in environment variables
3. Deploy through AWS Amplify Console
4. Set up scheduled data pulls for real-time updates

## Usage

Once deployed, league members can:
- View live scores for both their league and cross-league matchups
- Track standings within their individual league
- Monitor overall super league rankings
- See prize pool distributions for both league-specific and cross-league competitions

This creates an engaging fantasy football experience that brings together multiple leagues while maintaining the competitive structure that makes fantasy football fun.