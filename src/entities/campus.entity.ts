import type { Campus as CampusType } from '@/models/types';

export class Campus {
  readonly id: number;
  readonly nomecampus: string;

  private constructor(data: CampusType) {
    this.id = data.id;
    this.nomecampus = data.nomecampus;
  }

  static fromApi(data: CampusType): Campus {
    return new Campus(data);
  }

  static fromApiList(data: CampusType[]): Campus[] {
    return data.map(Campus.fromApi);
  }

  toApi(): CampusType {
    return { id: this.id, nomecampus: this.nomecampus };
  }

  get nome(): string {
    return this.nomecampus;
  }
}
