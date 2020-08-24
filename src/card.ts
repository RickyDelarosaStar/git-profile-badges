import {
  Trophy,
  TotalStarTrophy,
  TotalCommitTrophy,
  TotalFollowerTrophy,
  TotalIssueTrophy,
  TotalPullRequestTrophy,
  TotalRepositoryTrophy,
} from "./trophies.ts";
import { UserInfo } from "./github_api_client.ts";
import { CONSTANTS } from "./utils.ts";

export class Card {
  private width = 0;
  private height = 0;
  constructor(
    private panelSize = CONSTANTS.DEFALT_PANEL_SIZE,
    private maxColumn = CONSTANTS.DEFALT_MAX_COLUMN,
    private maxRow = CONSTANTS.DEFALT_MAX_ROW,
  ) {
    this.width = panelSize * this.maxColumn;
  }
  render(userInfo: UserInfo): string {
    const trophyList = new Array<Trophy>(
      new TotalStarTrophy(userInfo.totalStargazers),
      new TotalCommitTrophy(userInfo.totalCommits),
      new TotalFollowerTrophy(userInfo.totalFollowers),
      new TotalIssueTrophy(userInfo.totalIssues),
      new TotalPullRequestTrophy(userInfo.totalPullRequests),
      new TotalRepositoryTrophy(userInfo.totalRepositories),
    );

    let row = Math.floor((trophyList.length - 1) / this.maxColumn) + 1;
    if (row > this.maxRow) {
      row = this.maxRow;
    }
    this.height = this.panelSize * row;

    const renderedTrophy = trophyList.reduce(
      (sum: string, trophy: Trophy, i: number) => {
        const x = this.panelSize * (i % this.maxColumn);
        const y = this.panelSize * Math.floor(i / this.maxColumn);
        return sum + trophy.render(x, y, this.panelSize);
      },
      "",
    );
    return `
    <svg
      width="${this.width}"
      height="${this.height}"
      viewBox="0 0 ${this.width} ${this.height}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      ${renderedTrophy}
    </svg>`;
  }
}
